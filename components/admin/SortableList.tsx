"use client";

import { useState, type ReactNode } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export function SortableItem({
  id,
  children,
}: {
  id: string;
  children: (dragHandle: ReactNode) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const handle = (
    <button
      type="button"
      {...attributes}
      {...listeners}
      aria-label="Sürükleyerek sırala"
      className="cursor-grab touch-none rounded-md p-1.5 text-navy-900/35 hover:bg-navy-950/5 active:cursor-grabbing dark:text-white/30 dark:hover:bg-white/10"
    >
      <GripVertical className="size-4.5" aria-hidden="true" />
    </button>
  );

  return (
    <div ref={setNodeRef} style={style}>
      {children(handle)}
    </div>
  );
}

export default function SortableList<T>({
  items,
  getId,
  onReorder,
  children,
}: {
  items: T[];
  getId: (item: T) => string;
  onReorder: (orderedIds: string[]) => void;
  children: (item: T, dragHandle: ReactNode) => ReactNode;
}) {
  const [localItems, setLocalItems] = useState(items);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  if (JSON.stringify(items.map(getId)) !== JSON.stringify(localItems.map(getId)) && items.length !== localItems.length) {
    // External items changed (e.g. after create/delete) — resync.
    setLocalItems(items);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localItems.findIndex((i) => getId(i) === active.id);
    const newIndex = localItems.findIndex((i) => getId(i) === over.id);
    const reordered = arrayMove(localItems, oldIndex, newIndex);
    setLocalItems(reordered);
    onReorder(reordered.map(getId));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={localItems.map(getId)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {localItems.map((item) => (
            <SortableItem key={getId(item)} id={getId(item)}>
              {(handle) => children(item, handle)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
