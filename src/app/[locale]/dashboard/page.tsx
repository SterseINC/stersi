'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import CreateListModal from '@/components/CreateListModal';
import EditListModal from '@/components/EditListModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import ShareListModal from '@/components/ShareListModal';

interface ListType {
  _id: string;
  title: string;
  description: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Dashboard');

  const [lists, setLists] = useState<ListType[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingList, setEditingList] = useState<ListType | null>(null);
  const [deletingListId, setDeletingListId] = useState<string | null>(null);
  const [sharingListId, setSharingListId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push(`/${locale}/signin`);
      return;
    }

    const fetchLists = async () => {
      try {
        const res = await fetch('/api/list');
        if (res.ok) {
          const data = await res.json();
          setLists(data);
        }
      } catch (error) {
        console.error('Failed to fetch lists:', error);
      }
    };

    fetchLists();
  }, [session, status, router, locale]);

  const handleCreateList = async (title: string, description: string) => {
    try {
      const res = await fetch('/api/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        const newList = await res.json();
        setLists(prevLists => [newList, ...prevLists]);
      } else {
        console.error('Failed to create list');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditSave = async (newTitle: string, newDescription: string) => {
    if (!editingList) return;

    try {
      const res = await fetch(`/api/list/${editingList._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, description: newDescription }),
      });

      if (res.ok) {
        setLists(prevLists =>
          prevLists.map(list =>
            list._id === editingList._id
              ? { ...list, title: newTitle, description: newDescription }
              : list
          )
        );
      } else {
        console.error('Failed to update list');
      }
    } catch (error) {
      console.error('Error updating list:', error);
    } finally {
      setEditingList(null);
    }
  };

  const handleDeleteList = async () => {
    if (!deletingListId) return;

    try {
      const res = await fetch(`/api/list/${deletingListId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setLists(prevLists => prevLists.filter(list => list._id !== deletingListId));
      } else {
        console.error('Failed to delete list');
      }
    } catch (error) {
      console.error('Error deleting list:', error);
    } finally {
      setDeletingListId(null);
    }
  };

  const handleShareList = async (email: string) => {
    if (!sharingListId) return;

    try {
      const res = await fetch(`/api/list/${sharingListId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        alert(t('shareSuccess', { defaultValue: 'List shared successfully!' }));
      } else if (res.status === 404) {
        alert(t('userNotFound', { defaultValue: 'User not found.' }));
      } else {
        console.error('Failed to share list');
      }
    } catch (error) {
      console.error('Error sharing list:', error);
    } finally {
      setSharingListId(null);
    }
  };

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="h-10 w-40 bg-white rounded-full animate-pulse"></div>
            <div className="h-10 w-32 bg-white rounded-full animate-pulse"></div>
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-md animate-pulse flex flex-col gap-4">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="mt-4 h-8 bg-gray-300 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }
  
  if (!session) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t('myLists')}</h1>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full transition cursor-pointer"
            onClick={() => setShowCreateModal(true)}
          >
            {t('createList')}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {lists.map((list) => (
            <div key={list._id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col">
              <div className="flex justify-between flex-col items-start mb-2 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{list.title}</h2>
                  <p className="text-sm text-gray-500">{list.description}</p>
                </div>
                <div className="flex flex-col gap-2 items-start">
                  <button
                    onClick={() => setEditingList(list)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold text-sm py-2 px-4 rounded-full transition cursor-pointer"
                  >
                    ✏️ {t('edit', { defaultValue: 'Edit' })}
                  </button>
                  <button
                    onClick={() => setSharingListId(list._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-2 px-4 rounded-full transition cursor-pointer"
                  >
                    📤 {t('share', { defaultValue: 'Share' })}
                  </button>
                  <button
                    onClick={() => setDeletingListId(list._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold text-sm py-2 px-4 rounded-full transition cursor-pointer"
                  >
                    🗑️ {t('delete', { defaultValue: 'Delete' })}
                  </button>
                </div>
              </div>

              <Link
                href={`/${locale}/dashboard/${list._id}`}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-2 px-4 rounded-full transition text-center cursor-pointer"
              >
                {t('viewList', { defaultValue: 'View List' })}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <CreateListModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateList}
        />
      )}

      {editingList && (
        <EditListModal
          initialTitle={editingList.title}
          initialDescription={editingList.description}
          onClose={() => setEditingList(null)}
          onSave={handleEditSave}
        />
      )}

      {deletingListId && (
        <ConfirmDeleteModal
          onClose={() => setDeletingListId(null)}
          onConfirm={handleDeleteList}
        />
      )}

      {sharingListId && (
        <ShareListModal
          onClose={() => setSharingListId(null)}
          onShare={handleShareList}
        />
      )}
    </main>
  );
}
