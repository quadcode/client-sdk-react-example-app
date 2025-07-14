import {createContext} from 'react';
import {Auth} from "../types/Auth.ts";

export const AuthContext = createContext<Auth | null>(null);
