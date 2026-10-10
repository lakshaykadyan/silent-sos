import {
  FiAlertCircle,
  FiUsers
} from 'react-icons/fi';

import ContactCard from './ContactCard';

function ContactList({
  contacts,
  isLoading,
  errorMessage,
  onEdit,
  onDelete,
  deletingContactId
}) {
  if (isLoading) {
    return (
      <section className="contacts-state">
        <FiUsers
          aria-hidden="true"
        />

        <h2>
          Loading emergency contacts
        </h2>

        <p>
          Retrieving your trusted emergency network.
        </p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="contacts-state contacts-state--error">
        <FiAlertCircle
          aria-hidden="true"
        />

        <h2>
          Unable to load contacts
        </h2>

        <p>
          {errorMessage}
        </p>
      </section>
    );
  }

  if (!contacts.length) {
    return (
      <section className="contacts-state">
        <FiUsers
          aria-hidden="true"
        />

        <h2>
          No emergency contacts yet
        </h2>

        <p>
          Add trusted people who should be notified
          when you activate an emergency alert.
        </p>
      </section>
    );
  }

  return (
    <section className="contact-list">
      {contacts.map((contact) => (
        <ContactCard
          key={contact._id}
          contact={contact}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={
            deletingContactId === contact._id
          }
        />
      ))}
    </section>
  );
}

export default ContactList;