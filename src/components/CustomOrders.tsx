import { useState } from 'react';
import { Check, Send } from 'lucide-react';

export function CustomOrders() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: 'painting',
    size: 'medium',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-cream-50 border border-cream-300 text-charcoal-800 placeholder-charcoal-400 outline-none focus:ring-2 focus:ring-blush-300 focus:border-blush-300 transition-all';

  return (
    <section id="custom-orders" className="py-24 px-4 sm:px-6 bg-gradient-to-b from-cream-100 to-cream-50">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: description */}
          <div className="md:sticky md:top-24">
            <p className="text-sage-500 font-medium tracking-widest uppercase text-xs mb-3">
              Made Just For You
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-medium text-charcoal-900 leading-tight mb-6">
              Commission a<br />custom piece
            </h2>
            <p className="text-charcoal-700 leading-relaxed mb-8">
              Have a vision you'd like brought to life? I work closely with each
              client to create one-of-a-kind pieces — whether it's a portrait of
              a loved one, a favorite landscape, or a fashion-inspired canvas for
              your space.
            </p>

            <div className="space-y-5">
              {[
                { title: 'Consultation', text: 'We discuss your vision, colors, size, and mood.' },
                { title: 'Sketch & Approve', text: 'I share a preliminary sketch for your feedback.' },
                { title: 'Paint & Deliver', text: '2–4 weeks of painting, then carefully shipped to you.' },
              ].map((step, i) => (
                <div key={step.title} className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-blush-100 text-blush-600 flex items-center justify-center font-serif font-semibold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-charcoal-900">{step.title}</p>
                    <p className="text-sm text-charcoal-500 mt-0.5">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 shadow-sm border border-cream-200">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-sage-500" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-charcoal-900 mb-3">
                  Thank you!
                </h3>
                <p className="text-charcoal-600 max-w-sm">
                  Your commission request has been received. I'll get back to you
                  within 2–3 days to begin our creative conversation.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', type: 'painting', size: 'medium', description: '' });
                  }}
                  className="mt-6 px-6 py-2.5 rounded-full text-sm font-medium text-charcoal-600 hover:bg-cream-200 transition-colors"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Your name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@example.com"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                      Type
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className={inputClass}
                    >
                      <option value="painting">Painting</option>
                      <option value="portrait">Portrait</option>
                      <option value="fashion">Fashion art</option>
                      <option value="watercolor">Watercolor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                      Size
                    </label>
                    <select
                      value={form.size}
                      onChange={(e) => setForm({ ...form, size: e.target.value })}
                      className={inputClass}
                    >
                      <option value="small">Small (up to 16")</option>
                      <option value="medium">Medium (16–24")</option>
                      <option value="large">Large (24–36")</option>
                      <option value="xlarge">Extra large (36"+)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Tell me about your vision
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Colors, subject, mood, where it will hang..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-blush-500 text-cream-50 font-medium hover:bg-blush-600 transition-colors shadow-md"
                >
                  <Send className="w-4 h-4" />
                  Send Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
