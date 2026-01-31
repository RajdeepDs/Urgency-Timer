import {
  BlockStack,
  Text,
  Box,
  Button,
  Card,
  InlineStack,
} from "@shopify/polaris";

interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: React.ReactNode;
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  illustration,
}: EmptyStateProps) {
  return (
    <Card padding="1200">
      <BlockStack gap="200" align="center">
        {illustration && <Box paddingBlockEnd="400">{illustration}</Box>}

        <Text as="h2" variant="headingLg" alignment="center">
          {title}
        </Text>

        {message && (
          <Text as="p" variant="bodyMd" alignment="center" tone="subdued">
            {message}
          </Text>
        )}

        {actionLabel && onAction && (
          <Box paddingBlockStart="400">
            <InlineStack align="center">
              <Button variant="primary" size="large" onClick={onAction}>
                {actionLabel}
              </Button>
            </InlineStack>
          </Box>
        )}
      </BlockStack>
    </Card>
  );
}
