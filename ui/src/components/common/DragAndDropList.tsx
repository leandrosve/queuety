import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, OnDragEndResponder } from 'react-beautiful-dnd';
import queueMocks from '../player/queue/queueMocks';
import { PlayerQueueItem } from '../player/queue/PlayerQueue';

const reorder = <T,>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

interface DraggableItem {
  id: string | number;
}

interface Props<T extends DraggableItem> {
  items: T[];
  renderItem: (item: T, isDragging?: boolean) => JSX.Element;
}

const DragAndDropList = <T extends DraggableItem>({ items: initialItems, renderItem }: Props<T>) => {
  const [items, setItems] = useState<T[]>(initialItems);

  const onDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const quotes = reorder(items, result.source.index, result.destination.index);

    setItems(quotes);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='list'>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {items.map((item: T, index: number) => (
              <Item renderItem={renderItem} item={item} index={index} key={item.id} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

interface ItemProps<T extends DraggableItem> {
  item: T;
  renderItem: (item: T, isDragging?: boolean) => JSX.Element;
  index: number;
}
const Item = <T extends DraggableItem>({ item, index, renderItem }: ItemProps<T>) => {
  return (
    <Draggable draggableId={`${item.id}`} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          {renderItem(item, snapshot.isDragging)}
        </div>
      )}
    </Draggable>
  );
};

export default DragAndDropList;
