'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductForm from '@/components/ProductForm';

export default function NewProductPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    getDocs(collection(db, 'products'))
      .then((snap) => setAllProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
      Зарежда се...
    </div>
  );

  return <ProductForm allProducts={allProducts} />;
}
