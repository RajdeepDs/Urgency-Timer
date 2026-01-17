import { useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  Grid,
  InlineGrid,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();

  const product = responseJson.data!.productCreate!.product!;
  const variantId = product.variants.edges[0]!.node!.id!;

  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );

  const variantResponseJson = await variantResponse.json();

  return {
    product: responseJson!.data!.productCreate!.product,
    variant:
      variantResponseJson!.data!.productVariantsBulkUpdate!.productVariants,
  };
};

export default function Index() {
  const fetcher = useFetcher<typeof action>();

  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);
  const generateProduct = () => fetcher.submit({}, { method: "POST" });

  return (
    <Page>
      <TitleBar title="Urgency Timer" />
      <Box paddingBlock="500">
        <InlineGrid columns={{ lg: 6 }} alignItems="center">
          <Grid.Cell columnSpan={{ lg: 5 }}>
            <Text variant="headingLg" as="h5">
              Countdown timers
            </Text>
          </Grid.Cell>

          <Grid.Cell>
            <InlineStack align="end">
              <Button variant="primary" size="large">
                Create a new timer
              </Button>
            </InlineStack>
          </Grid.Cell>
        </InlineGrid>
      </Box>
      <BlockStack gap="200">
        <Card>
          <Text as="h2" variant="bodyMd">
            You're currently on{" "}
            <Text as="span" variant="headingSm">
              Free Plan.
            </Text>{" "}
            (0/1000 monthly views). One visitor can have multiple views per
            session.
          </Text>
        </Card>
        <Card padding={"1200"}>
          <BlockStack gap="200" align="center">
            <Text as="h2" variant="headingLg" alignment="center">
              This is where you'll manage your timers.
            </Text>

            <Text as="p" variant="bodyMd" alignment="center">
              Start by creating your first countdown timer and publishing it to
              your store.
            </Text>

            <Box paddingBlockStart="400">
              <InlineStack align="center">
                <Button variant="primary" size="large">
                  Create a new timer
                </Button>
              </InlineStack>
            </Box>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
