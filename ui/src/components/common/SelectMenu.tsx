import { Button, ButtonProps, Flex, Menu, MenuButton, MenuItem, MenuList, Portal } from '@chakra-ui/react';
import { LuCheck, LuChevronDown } from 'react-icons/lu';
import { RefObject, ReactNode, useMemo } from 'react';

interface Props<T> {
  value: T;
  options: [value: T, label: string][];
  placeholder?: string;
  defaultValue?: T;
  containerRef?: RefObject<HTMLElement>;
  onChange?: (value: T) => void;
  icon?: ReactNode;
  triggerWidth?: string | number;
  maxHeight?: string | number;
  hideTriggerValue?: boolean;
  hideChevron?: boolean;
  variant?: string;
  buttonContent?: string | ReactNode;
  buttonProps?: ButtonProps;
  menuWidth?: number | string;
  renderItem?: (value: T) => ReactNode;
}
const SelectMenu = <T,>({
  value,
  options,
  placeholder,
  icon,
  triggerWidth,
  hideTriggerValue,
  hideChevron,
  defaultValue,
  maxHeight,
  containerRef,
  onChange,
  variant,
  buttonContent,
  buttonProps,
  menuWidth = '300px',
  renderItem,
}: Props<T>) => {
  const triggerValue = useMemo(() => {
    if (hideTriggerValue) return null;
    return options.find(([val]) => val === (value ?? defaultValue))?.[1] || placeholder;
  }, [options, defaultValue, placeholder, hideTriggerValue, value]);
  return (
    <Menu strategy='absolute' autoSelect={false} computePositionOnMount placement='bottom-start'>
      <MenuButton
        variant={variant ?? 'outline'}
        as={Button}
        rightIcon={!hideChevron ? <LuChevronDown /> : undefined}
        width={triggerWidth}
        justifyContent='space-between'
        textAlign={'start'}
        {...buttonProps}
      >
        {buttonContent ?? (
          <Flex gap={3} alignItems='center'>
            {icon}
            {triggerValue}
          </Flex>
        )}
      </MenuButton>
      <Portal containerRef={containerRef}>
        <MenuList zIndex={10000} width={menuWidth} fontSize='sm' padding={2} maxHeight={maxHeight} overflow='hidden' overflowY='auto'>
          {options.map(([val, lab]) => (
            <MenuItem key={`${val}`} justifyContent='space-between' onClick={() => onChange?.(val)}>
              {renderItem ? (
                renderItem(val)
              ) : (
                <>
                  <span>{lab}</span>
                  {val === value && <LuCheck />}
                </>
              )}
            </MenuItem>
          ))}
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default SelectMenu;
