'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import AddItemModal from '@/components/AddItemModal';

interface ListItem {
  id: string;
  name: string;
  quantity?: string;
  bought: boolean;
}
interface ListType {
  _id: string;
  title: string;
  description?: string;
  items: ListItem[];
}


export default function ListDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { listId } = useParams() as { listId: string };
  const t = useTranslations('List');

  const [list, setList] = useState<ListType | null>(null);
  const [items, setItems] = useState<ListItem[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/signin');
      return;
    }

    const fetchList = async () => {
      try {
        const res = await fetch(`/api/list/${listId}`);
        if (res.ok) {
          const data = await res.json();
          setList(data);
          setItems(data.items || []);
        } else {
          router.push('/dashboard'); // Redirect if list not found
        }
      } catch (error) {
        console.error('Failed to fetch list:', error);
        router.push('/dashboard');
      }
    };

    fetchList();
  }, [session, status, router, listId]);

  const toggleBought = (itemId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, bought: !item.bought } : item
      )
    );
    // TODO: Update MongoDB to save bought/unbought
  };

  const handleAddItem = (item: { name: string; quantity: string }) => {
    const newItem = {
      id: Date.now().toString(),
      name: item.name,
      quantity: item.quantity,
      bought: false,
    };
    setItems(prevItems => [...prevItems, newItem]);

    // TODO: Save to MongoDB
  };

  if (!list) return <p className="text-center mt-10">Loading...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {list.title || t('listTitleDefault', { defaultValue: 'Shopping List' })}
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-full"
            >
              + {t('addItem', { defaultValue: 'Add New Item' })}
            </button>
            <Link
              href={`/dashboard`}
              className="text-green-600 hover:text-green-700 text-sm flex items-center"
            >
              ← {t('back', { defaultValue: 'Back to Lists' })}
            </Link>
          </div>
        </div>

        <ul className="space-y-4">
          {items.map(item => (
            <li
              key={item.id}
              onClick={() => toggleBought(item.id)}
              className={`flex items-center justify-between p-4 bg-white rounded-lg shadow-sm cursor-pointer transition ${
                item.bought ? 'opacity-50 line-through' : ''
              }`}
            >
              <div>
                <span className="font-medium">{item.name}</span>
                {item.quantity && (
                  <span className="ml-2 text-gray-400 text-xs">({item.quantity})</span>
                )}
              </div>
              <span
                className={`w-4 h-4 rounded-full border ${
                  item.bought ? 'bg-green-500' : ''
                }`}
              ></span>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <AddItemModal
          onClose={() => setShowModal(false)}
          onAddItem={handleAddItem}
        />
      )}
    </main>
  );
}
