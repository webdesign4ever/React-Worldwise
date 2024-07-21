import { createContext, useState, useEffect, useContext, useReducer, useCallback } from "react";

// const BASE_URL = "http://localhost:9000";
const BASE_URL = "https://glimmer-enchanting-kingfisher.glitch.me";
const CitiesContext = createContext();

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: ''
}
function reducer(state, action) {
    switch (action.type) {
        case 'loading':
            return {
                ...state, isLoading: true,
            };
        case 'cities/loaded':
            return {
                ...state, isLoading: false, cities: action.payload,
            };
        case 'city/loaded':
            return {
                ...state, isLoading: false, currentCity: action.payload,
            };
        case 'city/created':
            return {
                ...state, isLoading: false, cities: [...state.cities, action.payload], currentCity: action.payload
            };

        case 'city/deleted':
            return {
                ...state, isLoading: false, cities: state.cities.filter(city => city.id !== action.payload), currentCity: {},
            };

        case 'rejected':
            return {
                ...state, isLoading: false, error: action.payload,
            };

        default:
            throw new Error('Unknown action type');
    }
}

function CitiesProvider({ children }) {
    // const [cities, setCities] = useState([]);
    const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(reducer, initialState);
    // const [isLoading, setIsLoading] = useState(false);
    // const [currentCity, setCurrentCity] = useState({});

    useEffect(function () {
        async function fetchCities() {
            dispatch({ type: 'loading' })
            try {
                // setIsLoading(true);
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                // setCities(data);
                dispatch({ type: 'cities/loaded', payload: data })
            }
            catch {
                // alert('There was an error loading data..');
                dispatch({ type: 'rejected', payload: 'There was an error loading cities..' })
            }
            // finally {
            //     setIsLoading(false);
            // }
        }
        fetchCities();
    }, [])

    const getCity = useCallback(
        async function getCity(id) {
            if (Number(id) === currentCity.id) return;
            dispatch({ type: 'loading' })
            try {
                //setIsLoading(true);
                const res = await fetch(`${BASE_URL}/cities/${id}`);
                const data = await res.json();
                //setCurrentCity(data);
                dispatch({ type: 'city/loaded', payload: data })
            }
            catch {
                // alert('There was an error loading data..');
                dispatch({ type: 'rejected', payload: 'There was an error loading city..' })
            }
            // finally {
            //     setIsLoading(false);
            // }
        }, [currentCity.id])

    async function createCity(newCity) {
        dispatch({ type: 'loading' })
        try {
            //setIsLoading(true);
            const res = await fetch(`${BASE_URL}/cities`, {
                method: "POST",
                body: JSON.stringify(newCity),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            // setCities((cities) => [...cities, data])
            dispatch({ type: 'city/created', payload: data })

        }
        catch {
            // alert('There was an error creating city.');
            dispatch({ type: 'rejected', payload: 'There was an error creating city.' })
        }
        // finally {
        //     setIsLoading(false);
        // }
    }

    async function deleteCity(id) {
        dispatch({ type: 'loading' })
        try {
            // setIsLoading(true);
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: "DELETE",
            });
            // setCities((cities) => cities.filter(city => city.id !== id))
            dispatch({ type: 'city/deleted', payload: id })
        }
        catch {
            // alert('There was an error deleting city.');
            dispatch({ type: 'rejected', payload: 'There was an error deleting city.' })
        }
        // finally {
        //     setIsLoading(false);
        // }
    }

    const flagemojiToPNG = (flag) => {
        var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt()).map(char => String.fromCharCode(char - 127397).toLowerCase()).join('')
        return (<img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt='flag' />)
    }

    return <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity, flagemojiToPNG, createCity, deleteCity, error }}>
        {children}
    </CitiesContext.Provider>
}

function useCities() {
    const context = useContext(CitiesContext);
    if (context === undefined) throw new Error("CitiesContext was used outside the CitiesProvider");
    return context;
}


export { CitiesProvider, useCities };