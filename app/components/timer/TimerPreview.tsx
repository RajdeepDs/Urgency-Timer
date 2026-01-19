import { Box, BlockStack, Text, InlineStack, Card } from "@shopify/polaris";

interface TimerPreviewProps {
  title: string;
  subheading: string;
}

export default function TimerPreview({ title, subheading }: TimerPreviewProps) {
  return (
    <Box position="sticky" insetBlockStart="400">
      <Card>
        <BlockStack gap="400">
          <Box background="bg-surface-secondary" padding="800" borderRadius="200">
            <BlockStack gap="400" align="center">
              <Text as="h2" variant="heading2xl" alignment="center">
                {title || "Hurry up!"}
              </Text>
              <Text as="p" variant="bodyLg" alignment="center">
                {subheading || "Sale ends in:"}
              </Text>
              <Box paddingBlock="400">
                <InlineStack gap="200" align="center">
                  <Box>
                    <BlockStack gap="100" align="center">
                      <Text as="p" variant="heading3xl" fontWeight="bold">
                        00
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        Days
                      </Text>
                    </BlockStack>
                  </Box>
                  <Text as="p" variant="heading3xl">
                    :
                  </Text>
                  <Box>
                    <BlockStack gap="100" align="center">
                      <Text as="p" variant="heading3xl" fontWeight="bold">
                        23
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        Hrs
                      </Text>
                    </BlockStack>
                  </Box>
                  <Text as="p" variant="heading3xl">
                    :
                  </Text>
                  <Box>
                    <BlockStack gap="100" align="center">
                      <Text as="p" variant="heading3xl" fontWeight="bold">
                        59
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        Mins
                      </Text>
                    </BlockStack>
                  </Box>
                  <Text as="p" variant="heading3xl">
                    :
                  </Text>
                  <Box>
                    <BlockStack gap="100" align="center">
                      <Text as="p" variant="heading3xl" fontWeight="bold">
                        53
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        Secs
                      </Text>
                    </BlockStack>
                  </Box>
                </InlineStack>
              </Box>
            </BlockStack>
          </Box>
        </BlockStack>
      </Card>
    </Box>
  );
}
