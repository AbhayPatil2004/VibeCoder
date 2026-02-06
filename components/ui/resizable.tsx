"use client"

import * as React from "react"
import { GripVerticalIcon } from "lucide-react"
import {
  PanelGroup,
  Panel,
  PanelResizeHandle
} from "react-resizable-panels"


import { cn } from "@/lib/utils"

function ResizablePanelGroup(
  props: React.ComponentProps<typeof PanelGroup>
) {
  return <PanelGroup {...props} />
}

function ResizablePanel(
  props: React.ComponentProps<typeof Panel>
) {
  return <Panel {...props} />
}

function ResizableHandle(
  props: React.ComponentProps<typeof PanelResizeHandle>
) {
  return <PanelResizeHandle {...props} />
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
