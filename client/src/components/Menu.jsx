import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Menu.css';

const Menu = () => {
    return (
        <div className="menu">
            <nav>
                <ul>
                    <li className="textmenu">
                        <Link to="/laptop">LAPTOP</Link>
                    </li>
                    <li className="textmenu">
                        <Link to="/manhinh">MÀN HÌNH</Link>
                    </li>
                    <li className="textmenu">
                        <Link to="/linhkien">LINH KIỆN</Link>
                    </li>
                    <li className="textmenu">
                        <Link to="/gear">GEAR</Link>
                    </li>
                    <li className="textmenu">
                        <Link to="/phukienbanghe">PHỤ KIỆN/BÀN GHẾ</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Menu;