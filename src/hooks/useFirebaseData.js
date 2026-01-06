import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const patientsRef = collection(db, 'patients');
    const q = query(patientsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(patientsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { patients, loading };
};

export const useMedications = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const medicationsRef = collection(db, 'medications');
    const q = query(medicationsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const medicationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMedications(medicationsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { medications, loading };
};

export const useAdministrationLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logsRef = collection(db, 'administrationLogs');
    const q = query(logsRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // ✅ FIX: Handle both Firestore Timestamp and ISO string
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : (data.timestamp ? new Date(data.timestamp) : new Date()),
        };
      });
      setLogs(logsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { logs, loading };
};
