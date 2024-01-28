import { Suspense } from 'react';
import Loader from '~/components/Loader';

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<Loader/>}>
      <Component {...props} />
    </Suspense>
  );

export default Loadable;
