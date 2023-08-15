import { Button, ButtonProps, Flex, Menu, MenuButton, MenuItem, MenuList, Portal, forwardRef } from '@chakra-ui/react';
import { LuCheck, LuChevronDown } from 'react-icons/lu';
import { RefObject, ReactNode, useMemo } from 'react';

interface Props {
  value: string;
  options: [value: string, label: string][];
  placeholder?: string;
  defaultValue?: string;
  containerRef?: RefObject<HTMLElement>;
  onChange?: (value: string) => void;
  icon?: ReactNode;
  triggerWidth?: string | number;
  maxHeight?: string | number;
  hideTriggerValue?: boolean;
  hideChevron?: boolean;
  variant?: string;
}
const SelectMenu = ({
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
}: Props) => {
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
      >
        <Flex gap={3} alignItems='center'>
          {icon}
          {triggerValue}
        </Flex>
      </MenuButton>
      <Portal containerRef={containerRef}>
        <MenuList zIndex={10000} width='300px' fontSize='sm' padding={2} maxHeight={maxHeight} overflow='hidden' overflowY='auto'>
          {options.map(([val, lab]) => (
            <MenuItem key={val} justifyContent='space-between' onClick={() => onChange?.(val)}>
              <span>{lab}</span>
              {val === value && <LuCheck />}
            </MenuItem>
          ))}
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default SelectMenu;
