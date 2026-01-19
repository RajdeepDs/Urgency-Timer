import type { LoaderFunctionArgs } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import {
  Page,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  InlineStack,
  Grid,
  InlineGrid,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export default function Index() {
  const navigate = useNavigate();
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
              <Button
                variant="primary"
                size="large"
                onClick={() => navigate("/new")}
              >
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
                <Button
                  variant="primary"
                  size="large"
                  onClick={() => navigate("/new")}
                >
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
