import { DragDropContext, Droppable, Draggable, OnDragEndResponder } from 'react-beautiful-dnd';

interface DraggableItem {
  id: string | number;
}

interface Props<T extends DraggableItem> {
  items: T[];
  renderItem: (item: T, isDragging?: boolean) => JSX.Element;
  onReorder?: (id: string | number, destinationIndex: number) => void;
}

const DragAndDropList = <T extends DraggableItem>({ items, onReorder, renderItem }: Props<T>) => {
  const onDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }
    onReorder?.(items[result.source.index].id, result.destination.index);
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
