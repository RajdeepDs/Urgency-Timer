import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  InlineStack,
  ProgressBar,
  Button,
  Icon,
} from "@shopify/polaris";
import { CheckIcon } from "@shopify/polaris-icons";

export default function PricingPlans() {
  return (
    <Page
      backAction={{
        content: "Home",
        url: "/",
      }}
      title="Pricing Plans"
    >
      <Box paddingBlockEnd={{ xs: "400" }}>
        <Card>
          <Box>
            <InlineStack gap="200">
              <Text as="p">
                You're currently on <Text as="strong">Free plan.</Text> (0 /
                1000 monthly views). One visitor can have multiple views per
                session.
              </Text>
              <ProgressBar size="small" />
            </InlineStack>
          </Box>
        </Card>
      </Box>
      <Card>
        <InlineStack
          align="space-between"
          blockAlign="center"
          gap={{ xs: "400" }}
        >
          <BlockStack>
            <Text as="h2" variant="headingMd">
              Free Plan
            </Text>
            <InlineStack gap={{ xs: "400" }}>
              <Text as="span">
                Up to <Text as="strong">1000</Text> monthly views
              </Text>
              <InlineStack>
                <Icon source={CheckIcon} tone="base" />
                <Text as="span">Unlimited product timers</Text>
              </InlineStack>
              <InlineStack>
                <Icon source={CheckIcon} tone="base" />
                <Text as="span">Unlimited top bar timers</Text>
              </InlineStack>
            </InlineStack>
          </BlockStack>
          <Button disabled>Your current plan</Button>
        </InlineStack>
      </Card>
    </Page>
  );
}
