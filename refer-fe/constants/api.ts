
import { Platform } from "react-native";

export const API_URL =  Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : Platform.OS === 'ios'
? 'http://192.168.31.189:5000/api' :  'http://localhost:5000/api'

 