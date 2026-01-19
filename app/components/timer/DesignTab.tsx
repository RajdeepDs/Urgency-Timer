import {
  TextField,
  BlockStack,
  Text,
  Box,
  FormLayout,
  Button,
  RangeSlider,
  Checkbox,
} from "@shopify/polaris";
import { useState } from "react";

interface DesignTabProps {
  onContinue: () => void;
}

export default function DesignTab({ onContinue }: DesignTabProps) {
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(16);
  const [borderRadius, setBorderRadius] = useState(4);
  const [showBorder, setShowBorder] = useState(true);

  return (
    <FormLayout>
      <BlockStack gap="400">
        <Text as="h4" variant="headingSm" fontWeight="semibold">
          Timer Appearance
        </Text>

        <TextField
          label="Background color"
          value={backgroundColor}
          onChange={setBackgroundColor}
          autoComplete="off"
        />

        <TextField
          label="Text color"
          value={textColor}
          onChange={setTextColor}
          autoComplete="off"
        />

        <RangeSlider
          label="Font size"
          value={fontSize}
          onChange={setFontSize}
          min={12}
          max={48}
          output
        />

        <RangeSlider
          label="Border radius"
          value={borderRadius}
          onChange={setBorderRadius}
          min={0}
          max={20}
          output
        />

        <Checkbox
          label="Show border"
          checked={showBorder}
          onChange={setShowBorder}
        />
      </BlockStack>

      <Box paddingBlockStart="400">
        <Button fullWidth onClick={onContinue}>
          Continue to Placement
        </Button>
      </Box>
    </FormLayout>
  );
}
