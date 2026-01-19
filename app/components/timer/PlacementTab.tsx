import {
  BlockStack,
  Text,
  Box,
  FormLayout,
  Button,
  Select,
  RadioButton,
  Checkbox,
} from "@shopify/polaris";
import { useState } from "react";

interface PlacementTabProps {
  onSave: () => void;
}

export default function PlacementTab({ onSave }: PlacementTabProps) {
  const [position, setPosition] = useState("below-cart");
  const [alignment, setAlignment] = useState("center");
  const [showOnMobile, setShowOnMobile] = useState(true);
  const [showOnDesktop, setShowOnDesktop] = useState(true);

  return (
    <FormLayout>
      <BlockStack gap="400">
        <Text as="h4" variant="headingSm" fontWeight="semibold">
          Timer Placement
        </Text>

        <BlockStack gap="300">
          <Text as="p" variant="bodyMd">
            Position
          </Text>
          <RadioButton
            label="Below add to cart button"
            checked={position === "below-cart"}
            id="below-cart"
            name="position"
            onChange={() => setPosition("below-cart")}
          />
          <RadioButton
            label="Above add to cart button"
            checked={position === "above-cart"}
            id="above-cart"
            name="position"
            onChange={() => setPosition("above-cart")}
          />
          <RadioButton
            label="Below product title"
            checked={position === "below-title"}
            id="below-title"
            name="position"
            onChange={() => setPosition("below-title")}
          />
        </BlockStack>

        <Select
          label="Alignment"
          options={[
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ]}
          value={alignment}
          onChange={setAlignment}
        />

        <BlockStack gap="200">
          <Text as="p" variant="bodyMd" fontWeight="medium">
            Display settings
          </Text>
          <Checkbox
            label="Show on mobile devices"
            checked={showOnMobile}
            onChange={setShowOnMobile}
          />
          <Checkbox
            label="Show on desktop"
            checked={showOnDesktop}
            onChange={setShowOnDesktop}
          />
        </BlockStack>
      </BlockStack>

      <Box paddingBlockStart="400">
        <Button fullWidth variant="primary" onClick={onSave}>
          Save Timer
        </Button>
      </Box>
    </FormLayout>
  );
}
