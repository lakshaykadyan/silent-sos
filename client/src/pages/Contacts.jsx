import {
  useEffect,
  useState
} from 'react';

import {
  FiAlertCircle,
  FiPlus,
  FiShield,
  FiUsers
} from 'react-icons/fi';

import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import ContactForm from '../components/contacts/ContactForm';
import ContactList from '../components/contacts/ContactList';
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact
} from '../services/contactService';

function Contacts() {
  const [
    contacts,
    setContacts
  ] = useState([]);

  const [
    isLoading,
    setIsLoading
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage
  ] = useState('');

  const [
    showForm,
    setShowForm
  ] = useState(false);

  const [
    editingContact,
    setEditingContact
  ] = useState(null);

  const [
    isSaving,
    setIsSaving
  ] = useState(false);

  const [
    deletingContactId,
    setDeletingContactId
  ] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadInitialContacts = async () => {
      try {
        const result =
          await getContacts();

        if (!isMounted) {
          return;
        }

        const contactList =
          result?.data?.contacts || [];

        setContacts(contactList);
        setErrorMessage('');
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error.message ||
          'Unable to load emergency contacts.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialContacts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAddForm = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    if (isSaving) {
      return;
    }

    setShowForm(false);
    setEditingContact(null);
  };

  const handleSubmit = async (contactData) => {
    try {
      setIsSaving(true);
      setErrorMessage('');

      if (editingContact) {
        const result =
          await updateContact(
            editingContact._id,
            contactData
          );

        const updatedContact =
          result?.data?.contact;

        if (updatedContact) {
          setContacts((currentContacts) =>
            currentContacts.map(
              (currentContact) =>
                currentContact._id ===
                updatedContact._id
                  ? updatedContact
                  : currentContact
            )
          );
        }
      } else {
        const result =
          await createContact(
            contactData
          );

        const newContact =
          result?.data?.contact;

        if (newContact) {
          setContacts((currentContacts) => [
            ...currentContacts,
            newContact
          ]);
        }
      }

      setShowForm(false);
      setEditingContact(null);
    } catch (error) {
      setErrorMessage(
        error.message ||
        'Unable to save emergency contact.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (contact) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to remove ${contact.name} from your emergency contacts?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingContactId(
        contact._id
      );

      setErrorMessage('');

      await deleteContact(
        contact._id
      );

      setContacts((currentContacts) =>
        currentContacts.filter(
          (currentContact) =>
            currentContact._id !==
            contact._id
        )
      );
    } catch (error) {
      setErrorMessage(
        error.message ||
        'Unable to delete emergency contact.'
      );
    } finally {
      setDeletingContactId('');
    }
  };

  return (
    <div className="dashboard-page">
      <Header />

      <main className="dashboard-main">
        <div className="page-container">
          <div className="contacts-back">
            <BackButton />
          </div>

          <section className="dashboard-header">
            <div>
              <p className="dashboard-eyebrow">
                Trusted network
              </p>

              <h1>
                Emergency contacts
              </h1>

              <p>
                Manage the people who should receive
                notifications when you activate an
                emergency alert.
              </p>
            </div>

            <div className="dashboard-status">
              <span className="dashboard-status__dot" />

              <span>
                Protected network
              </span>
            </div>
          </section>

          {errorMessage && (
            <div
              className="contacts-page-error"
              role="alert"
            >
              <FiAlertCircle
                aria-hidden="true"
              />

              <span>
                {errorMessage}
              </span>
            </div>
          )}

          <section className="contacts-overview">
            <div className="contacts-overview__content">
              <div className="contacts-overview__icon">
                <FiShield
                  aria-hidden="true"
                />
              </div>

              <div>
                <p className="dashboard-card__eyebrow">
                  Safety network
                </p>

                <h2>
                  {contacts.length}{' '}
                  {contacts.length === 1
                    ? 'trusted contact'
                    : 'trusted contacts'}
                </h2>

                <p>
                  Your emergency contacts can be
                  notified when an SOS alert is
                  activated.
                </p>
              </div>
            </div>
          </section>

          {showForm && (
            <ContactForm
              contact={editingContact}
              onSubmit={handleSubmit}
              onCancel={handleCancelForm}
              isSaving={isSaving}
            />
          )}

          <section className="contacts-section">
            <div className="contacts-section__header">
              <div>
                <p className="dashboard-card__eyebrow">
                  Contact directory
                </p>

                <h2>
                  Your emergency contacts
                </h2>
              </div>

              <div className="contacts-section__actions">
                <div className="contacts-section__count">
                  <FiUsers
                    aria-hidden="true"
                  />

                  <span>
                    {contacts.length}
                  </span>
                </div>

                <button
                  type="button"
                  className="contacts-add-button"
                  onClick={handleOpenAddForm}
                  disabled={showForm}
                >
                  <FiPlus
                    aria-hidden="true"
                  />

                  <span>
                    Add contact
                  </span>
                </button>
              </div>
            </div>

            <ContactList
              contacts={contacts}
              isLoading={isLoading}
              errorMessage=""
              onEdit={handleEdit}
              onDelete={handleDelete}
              deletingContactId={
                deletingContactId
              }
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default Contacts;