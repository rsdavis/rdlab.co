import { useState } from "preact/hooks";

const styles = {
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.25rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#222",
  },
  input: {
    fontFamily: "inherit",
    fontSize: "1rem",
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    background: "#fff",
  },
  button: {
    fontFamily: "inherit",
    fontSize: "1rem",
    fontWeight: 600,
    padding: "0.75rem 1.5rem",
    background: "#222",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    alignSelf: "flex-start" as const,
    transition: "background 0.2s ease",
  },
  buttonHover: {
    background: "#444",
  },
  buttonDisabled: {
    background: "#666",
    cursor: "not-allowed",
  },
  success: {
    padding: "1rem",
    background: "#e8f5e9",
    borderRadius: "4px",
    color: "#2e7d32",
  },
  error: {
    color: "#c62828",
    fontSize: "0.875rem",
    margin: 0,
  },
};

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [isHovered, setIsHovered] = useState(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xykkjlyz", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div style={styles.success}>
        Thanks for reaching out! I'll get back to you soon.
      </div>
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.field}>
        <label for="name" style={styles.label}>Name *</label>
        <input type="text" id="name" name="name" required style={styles.input} />
      </div>
      <div style={styles.field}>
        <label for="email" style={styles.label}>Email *</label>
        <input type="email" id="email" name="email" required style={styles.input} />
      </div>
      <div style={styles.field}>
        <label for="message" style={styles.label}>Message *</label>
        <textarea id="message" name="message" rows={4} required style={styles.input} />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          ...styles.button,
          ...(isHovered && !isSubmitting ? styles.buttonHover : {}),
          ...(isSubmitting ? styles.buttonDisabled : {}),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
      {status === "error" && (
        <p style={styles.error}>Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
