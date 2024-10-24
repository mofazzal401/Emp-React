import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'; // You can create this CSS file for custom styling

const Header = () => {
    return (
        <header className=" text-center">
            <div className="">
                <h3 className="display-5">FARID NINE STARS AGRO (BD) LTD</h3>
                <p className="lead">
                    Paschim, Porakatla, Burigoyalini, Shyamnagar, Satkhira.
                </p>
            </div>
        </header>
    );
};

export default Header;
