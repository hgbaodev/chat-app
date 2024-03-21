// AvatarGroup.js

import { Avatar } from 'antd';

const AvatarGroup = ({ users }) => {
  var size = 30;
  if (users.length === 2) {
    size = 30;
    return (
      <div className="relative">
        <Avatar
          size={size}
          src={users[0].avatar}
          className="border-2 border-white"
        />
        <Avatar
          size={size}
          src={users[1].avatar}
          className="absolute top-5 left-1 z-0 -ml-6 border-2 border-white"
        />
      </div>
    );
  }
  if (users.length === 3) {
    return (
      <div className="relative w-[50px] h-[50px]">
      <Avatar
        size={size}
        src={users[0].avatar}
        className="border-2 border-white"
      />
      <Avatar
        size={size}
        src={users[1].avatar}
        className="absolute top-0 right-0 z-0 -ml-6 border-2 border-white"
      />
      <Avatar
        size={size}
        src={users[2].avatar}
        className="absolute bottom-0 left-0 z-0 border-2 border-white"
      />
    </div>
    );
  }

  if (users.length === 4) {
    size = 25;
    return (
        <div className="relative w-[50px] h-[50px]">
      <Avatar
        size={size}
        src={users[0].avatar}
        className="border-2 border-white"
      />
      <Avatar
        size={size}
        src={users[1].avatar}
        className="absolute top-0 right-0 z-0 -ml-6 border-2 border-white"
      />
      <Avatar
        size={size}
        src={users[2].avatar}
        className="absolute bottom-0 left-0 z-0 border-2 border-white"
      />
      <Avatar
        size={size}
        src={users[3].avatar}
        className="absolute top-5 right-0 z-0 border-2 border-white"
      />
    </div>
    );
  }

  return (
    <div className="relative w-[50px] h-[50px]">
      <Avatar
        size={size}
        src={users[0].avatar}
        className="border-2 border-white"
      />
      <Avatar
        size={size}
        src={users[1].avatar}
        className="absolute top-0 right-0 z-0 -ml-6 border-2 border-white"
      />
      <Avatar
        size={size}
        src={users[2].avatar}
        className="absolute bottom-0 left-0 z-0 border-2 border-white"
      />
      <Avatar
        size={size}
        className="absolute top-5 right-0 z-0 border-2 border-white"
      >
        +{users.length - 3}
      </Avatar>
    </div>
  );
};

export default AvatarGroup;
