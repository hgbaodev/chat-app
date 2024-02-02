import { Avatar, Button, Flex, Space, Typography } from 'antd';
import { faker } from '@faker-js/faker';
import useHover from '~/hooks/useHover';
import { AiOutlineEllipsis } from 'react-icons/ai';
import confetti from 'canvas-confetti';
import { useMemo } from 'react';
export const ContactItem = ({ active }) => {
  const [hoverRef, isHovering] = useHover();
  const handleConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const avatarSrc = useMemo(() => faker.image.avatar(), []);
  const fullName = useMemo(() => faker.person.fullName(), []);
  const message = useMemo(() => faker.lorem.sentence(), []);

  return (
    <Flex
      ref={hoverRef}
      className={`${
        active ? 'bg-blue-100' : 'bg-white hover:bg-neutral-100'
      } px-4 py-3 cursor-pointer`}
      align="center"
      justify="space-between"
    >
      <Space className="flex-1">
        <Avatar size={42} src={avatarSrc} />
        <Flex vertical justify="center">
          <Typography className="text-gray-700 font-semibold overflow-hidden whitespace-nowrap text-ellipsis max-w-[180px]">
            {fullName}
          </Typography>
          <Typography className="text-xs text-neutral-500 overflow-hidden whitespace-nowrap text-ellipsis max-w-[190px]">
            {message}
          </Typography>
        </Flex>
      </Space>
      {isHovering ? (
        <Button
          type="text"
          size="small"
          onClick={handleConfetti}
          icon={<AiOutlineEllipsis size={20} />}
        />
      ) : (
        <Typography className="text-[10px] text-neutral-500">
          {faker.date.anytime().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric'
          })}
        </Typography>
      )}
    </Flex>
  );
};
