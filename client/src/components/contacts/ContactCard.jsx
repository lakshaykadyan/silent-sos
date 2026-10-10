import {
  FiEdit2,
  FiMail,
  FiPhone,
  FiTrash2
} from 'react-icons/fi';

function ContactCard({
  contact,
  onEdit,
  onDelete,
  isDeleting
}) {
  const getInitials = (name) => {
    if (!name) {
      return 'EC';
    }

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const getPriorityLabel = (priority) => {
    if (priority === 1) {
      return 'Primary';
    }

    if (priority === 2) {
      return 'Secondary';
    }

    return `Priority ${priority || 3}`;
  };

  return (
    <article className="contact-card">
      <div className="contact-card__top">
        <div className="contact-card__identity">
          <div className="contact-card__avatar">
            {getInitials(contact.name)}
          </div>

          <div>
            <h2>
              {contact.name}
            </h2>

            <p>
              {contact.relationship ||
                'Emergency contact'}
            </p>
          </div>
        </div>

        <span
          className={`contact-card__priority contact-card__priority--${contact.priority || 3}`}
        >
          {getPriorityLabel(contact.priority)}
        </span>
      </div>

      <div className="contact-card__details">
        {contact.phone && (
          <div className="contact-card__detail">
            <span className="contact-card__detail-icon">
              <FiPhone
                aria-hidden="true"
              />
            </span>

            <div>
              <span>
                Phone
              </span>

              <strong>
                {contact.phone}
              </strong>
            </div>
          </div>
        )}

        {contact.email && (
          <div className="contact-card__detail">
            <span className="contact-card__detail-icon">
              <FiMail
                aria-hidden="true"
              />
            </span>

            <div>
              <span>
                Email
              </span>

              <strong>
                {contact.email}
              </strong>
            </div>
          </div>
        )}
      </div>

      <div className="contact-card__status">
        <span className="contact-card__status-indicator" />

        <span>
          {contact.isVerified
            ? 'Verified contact'
            : 'Verification pending'}
        </span>
      </div>

      <div className="contact-card__actions">
        <button
          type="button"
          className="contact-card__action contact-card__action--edit"
          onClick={() => onEdit(contact)}
          disabled={isDeleting}
        >
          <FiEdit2
            aria-hidden="true"
          />

          <span>
            Edit
          </span>
        </button>

        <button
          type="button"
          className="contact-card__action contact-card__action--delete"
          onClick={() => onDelete(contact)}
          disabled={isDeleting}
        >
          <FiTrash2
            aria-hidden="true"
          />

          <span>
            Delete
          </span>
        </button>
      </div>
    </article>
  );
}

export default ContactCard;