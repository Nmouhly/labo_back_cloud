// components/layouts/SimpleLayout.js
import { Outlet } from 'react-router-dom';

const SimpleLayout = () => {
  return (
    <div className="simple-layout">
      <main className="simple-main">
        <Outlet /> {/* Les sous-routes seront rendues ici */}
      </main>
    </div>
  );
};

export default SimpleLayout;
