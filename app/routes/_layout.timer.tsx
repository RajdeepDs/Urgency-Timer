import { useSearchParams } from "@remix-run/react";
import { Page, Text, BlockStack, Badge, Box, Tabs } from "@shopify/polaris";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { useCallback, useState } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export default function TimerConfigPage() {
  const [searchParams] = useSearchParams();
  const timerType = searchParams.get("type");

  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: "content-1",
      content: "Content",
      accessibilityLabel: "Contents",
      panelID: "content-1",
    },
    {
      id: "design-1",
      content: "Design",
      accessibilityLabel: "Design",
      panelID: "design-1",
    },
    {
      id: "placement-1",
      content: "Placement",
      accessibilityLabel: "Placement",
      panelID: "placement-1",
    },
  ];

  return (
    <Page
      title="Timer name"
      backAction={{
        content: "Back",
        url: "/",
      }}
      titleMetadata={<Badge>Not published</Badge>}
      subtitle="Timer ID: Save or Publish to show timer ID"
      primaryAction={{ content: "Publish" }}
    >
      <Box>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}></Tabs>
      </Box>
    </Page>
  );
}
