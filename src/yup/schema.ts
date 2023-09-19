import * as yup from "yup";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient().$extends({
  result: {
    product: {
      price: {
        needs: {
          sale_starts_at: true,
          sale_ends_at: true,
          regular_price: true,
          sale_price: true,
          on_sale: true,
        },
        compute({
          sale_starts_at,
          sale_ends_at,
          regular_price,
          sale_price,
          on_sale,
        }) {
          const currentDate = new Date();
          const is_sale =
            on_sale &&
            (!sale_starts_at ||
              (currentDate >= sale_starts_at &&
                (!sale_ends_at || currentDate <= sale_ends_at)));
          return is_sale ? sale_price ?? 0.0 : regular_price;
        },
      },
    },
    productVariation: {
      price: {
        needs: {
          sale_starts_at: true,
          sale_ends_at: true,
          regular_price: true,
          sale_price: true,
          on_sale: true,
        },
        compute({
          sale_starts_at,
          sale_ends_at,
          regular_price,
          sale_price,
          on_sale,
        }) {
          const currentDate = new Date();
          const is_sale =
            on_sale &&
            (!sale_starts_at ||
              (currentDate >= sale_starts_at &&
                (!sale_ends_at || currentDate <= sale_ends_at)));
          return is_sale ? sale_price ?? 0.0 : regular_price;
        },
      },
    },
  },
 
});

export const yup_account_verify_schema = yup.object({
  one_time_password: yup.string().required("OTP is required"),
  type: yup.string().required("OTP type is required"),
  phone_number: yup.string().required("Phone number is required"),
});

export const subscription_create_schema = (props: { customer_id: string }) => {
  const currentDate = new Date();
  // Set the time to 00:01 (1 minute past midnight)
  currentDate.setHours(0, 1, 0, 0);
  // Add 1 day to the date
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(currentDate.getDate() + 1);

  const commonDailyValidation = yup
    .number()
    .required("All Days and Quantity is required")

    .when("frequency_type", {
      is: "daily",
      then: (numberSchema) => numberSchema.default(1),
    });

  return yup.object({
    frequency_type: yup
      .string()

      .oneOf(["daily", "interval", "flexible"])
      .required("Frequency type is required"),

    delivery_intervals: yup
      .number()
      .min(1, "Delivery interval must be between 1 and 30")
      .max(30, "Delivery interval must be between 1 and 30")
      .when("frequency_type", {
        is: "interval",
        then: (numberSchema) =>
          numberSchema.required("Delivery interval is required"),
      }),
    /** */
    /** */
    start_date: yup
      .date()
      .required("Start date is required")
      .min(tomorrow, "Start date must be greater than today"),
    /**foreign keys */
    product_id: yup
      .string()
      .test({
        name: "product-already-subscribed",
        test: async function (value) {
          const subscription = await prisma.subscription.findFirst({
            where: {
              product_id: value,
              customer_id: props.customer_id as string,
            },
          });
          return !subscription;
        },
        message: "This product is already subscribed by this customer",
      })
      .required("Product is required"),
    delivery_time_slot_id: yup.string(),
    variant_id: yup.string().test({
      name: "variant-required",
      test: async function (value) {
        const product_id = this.parent.product_id;
        if (!product_id) {
          // If product_id is not provided, validation passes.
          return true;
        }
        const product = await prisma.product.findUnique({
          where: {
            id: product_id,
          },
          include: {
            variations: true,
          },
        });
        // If product is not found or its type is not "VARIABLE," validation passes.
        if (!product || product.type !== "VARIABLE") {
          return true;
        }
        // If product is of type "VARIABLE" and has a valid variant_id, validation requires variant_id.
        if (product.variations.some((v) => v.id === value)) {
          return !!value; // Require variant_id if it's a valid variation for the product.
        }
        // If product is of type "VARIABLE" but variant_id is not valid, validation fails.
        return false;
      },
      message:
        "Variant is required when product_id is provided for non-SIMPLE products",
    }),
    customer_id: yup.string().default(props.customer_id as string),
    days_and_quantity: yup
      .object({
        sunday: commonDailyValidation,
        monday: commonDailyValidation,
        tuesday: commonDailyValidation,
        wednesday: commonDailyValidation,
        thursday: commonDailyValidation,
        friday: commonDailyValidation,
        saturday: commonDailyValidation,
      })
      .when("frequency_type", {
        is: "flexible",
        then: (schema) =>
          schema.required(
            "For flexible frequency, please specify all the days of the week with quantity"
          ),
      }),
  });
};

export const order_create_schema = (props: { customer_id: string }) => {
  return yup.object({
    billing_address_id: yup.string().required("Billing address is required"),
    shipping_address_id: yup.string().required("Shipping address is required"),
    payment_method: yup.string().required("Payment method is required"),
    transaction_id: yup.string().required("Transaction id is required"),
    discount_total: yup.number().default(0.0),
    shipping_total: yup.number().default(0.0),
    total: yup.number().required(),
    customer_id: yup.string().default(props.customer_id as string),
    order_items_line: yup
      .array()
      .of(
        yup.object({
          item_id: yup
            .string()
            // .test({
            //   name: "product_status",
            //   test: async function (value) {
            //     const product = await prisma.product.findUnique({
            //       where: {
            //         id: value,
            //       },
            //     });

            //     if (!product) {
            //       throw new yup.ValidationError(
            //         "Item id is not valid",
            //         value,
            //         "item_id"
            //       );
            //     }

            //     if (product.status === "DRAFT") {
            //       throw new yup.ValidationError(
            //         `Product ${product.title} is not published`,
            //         value,
            //         "item_id"
            //       );
            //     }

            //     if (product.status === "TRASH") {
            //       throw new yup.ValidationError(
            //         `Product ${product.title} is trashed`,
            //         value,
            //         "item_id"
            //       );
            //     }

            //     return true;
            //   },
            // })
            .required("Item id is required"),
          item_variant_id: yup.string().test({
            name: "variant-required",
            test: async function (value) {
              const product_id = this.parent.item_id;
              if (!product_id) {
                // If product_id is not provided, validation passes.
                return true;
              }
              const product = await prisma.product.findUnique({
                where: {
                  id: product_id,
                },
                include: {
                  variations: true,
                },
              });
              // If product is not found or its type is not "VARIABLE," validation passes.
              if (!product || product.type !== "VARIABLE") {
                return true;
              }
              // If product is of type "VARIABLE" and has a valid variant_id, validation requires variant_id.
              if (product.variations.some((v) => v.id === value)) {
                return !!value; // Require variant_id if it's a valid variation for the product.
              }
              // If product is of type "VARIABLE" but variant_id is not valid, validation fails.
              return false;
            },
            message:
              "Variant is required when product_id is provided for non-SIMPLE products",
          }),
          quantity: yup.number().default(1),
          subtotal: yup
            .number()
            .test({
              name: "subtotal",
              test: async function (value) {
                const product = await prisma.product.findUnique({
                  where: {
                    id: this.parent.item_id,
                  },
                });
                if (product?.type === "SIMPLE") {
                  return (
                    value === (product.price as number) * this.parent.quantity
                  );
                }
                if (product?.type === "VARIABLE") {
                  const variation = await prisma.productVariation.findUnique({
                    where: {
                      id: this.parent.item_variant_id,
                      product_id: this.parent.item_id,
                    },
                  });
                  return (
                    value ===
                    (variation?.price as number) * this.parent.quantity
                  );
                }
                return true;
              },
            })
            .required("Subtotal is required and valid"),
          total: yup.number().required("Total is required"),
        })
      )
      .required("Order items are required"),
    coupons_line: yup
      .array()
      .of(
        yup.object({
          id: yup.string().required(),
        })
      )
      .optional(),
  });
};
