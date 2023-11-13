import {createContext} from 'react';

const AppContext = createContext({
    user: null,
    repos: []
});

export default AppContext;