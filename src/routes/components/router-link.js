import Link from 'next/link';
import { forwardRef } from 'react';

// ----------------------------------------------------------------------

const RouterLink = forwardRef(({ ...other }, ref) => <Link ref={ref} {...other} />);

RouterLink.displayName = 'RouterLink';

export default RouterLink;
