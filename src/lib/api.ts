import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface ReservationRequest {
  name: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message: string;
}

const maskName = (name: string) => {
  if (!name) return "***";
  if (name.length <= 2) return name.substring(0, 1) + "*";
  return name.substring(0, 1) + "*" + name.substring(2);
};

export interface BlockedDateInfo {
  date: string;
  maskedName: string;
  checkIn: string;
  checkOut: string;
}

export interface FullReservation extends ReservationRequest {
  id: string;
}

export const getReservationList = async (): Promise<FullReservation[]> => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return [];
  
  try {
    const snapshot = await getDocs(collection(db, "reservations"));
    const list: FullReservation[] = [];
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      if (data.status === 'cancelled') return;
      list.push({
        id: doc.id,
        ...data
      } as FullReservation);
    });
    // 날짜 순 정렬
    return list.sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  } catch (error) {
    console.error("Error fetching reservation list: ", error);
    return [];
  }
};

export const getReservedDates = async (): Promise<BlockedDateInfo[]> => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.warn("Firebase api key missing. Returning empty reserved dates.");
    return [];
  }
  
  try {
    const snapshot = await getDocs(collection(db, "reservations"));
    const blockedDates: BlockedDateInfo[] = [];
    
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      if (data.status === 'cancelled') return;
      
      const start = new Date(data.checkIn);
      const end = new Date(data.checkOut);
      const current = new Date(start);
      // 숙박하는 '밤(night)' 기준의 날짜들을 차단 
      while (current < end) {
        blockedDates.push({
          date: current.toISOString().split('T')[0],
          maskedName: maskName(data.name || ""),
          checkIn: data.checkIn,
          checkOut: data.checkOut
        });
        current.setDate(current.getDate() + 1);
      }
    });
    return blockedDates;
  } catch (error) {
    console.error("Error fetching reservations: ", error);
    return [];
  }
};

export const submitReservation = async (data: ReservationRequest) => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.warn("Firebase api key missing. Faking success.");
    return { success: true, id: "fake-id" };
  }

  try {
    const docRef = await addDoc(collection(db, "reservations"), {
      ...data,
      status: "requested",
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding reservation: ", error);
    return { success: false, error };
  }
};
