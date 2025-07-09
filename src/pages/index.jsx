import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Devices from "./Devices";

import DeviceDetails from "./DeviceDetails";

import OrderDevice from "./OrderDevice";

import Orders from "./Orders";

import Profile from "./Profile";

import Home from "./Home";

import Contact from "./Contact";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Devices: Devices,
    
    DeviceDetails: DeviceDetails,
    
    OrderDevice: OrderDevice,
    
    Orders: Orders,
    
    Profile: Profile,
    
    Home: Home,
    
    Contact: Contact,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Devices" element={<Devices />} />
                
                <Route path="/DeviceDetails" element={<DeviceDetails />} />
                
                <Route path="/OrderDevice" element={<OrderDevice />} />
                
                <Route path="/Orders" element={<Orders />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Contact" element={<Contact />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}