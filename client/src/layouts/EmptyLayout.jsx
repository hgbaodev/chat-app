import { Outlet } from 'react-router-dom';

const EmptyLayout = () => {
  return (
    <div>
      <h1>EmptyLayout</h1>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default EmptyLayout;
