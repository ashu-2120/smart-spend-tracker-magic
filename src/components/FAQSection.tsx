import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "Is my financial data secure?",
      answer: "Absolutely. We use bank-level 256-bit encryption to protect your data. All information is stored securely and we never share your personal financial information with third parties. We're SOC 2 compliant and follow industry best practices for data security."
    },
    {
      question: "How does the auto-categorization work?",
      answer: "Our AI-powered categorization system learns from your spending patterns and merchant data to automatically sort your expenses. It gets smarter over time and you can always manually adjust categories to improve accuracy. The system recognizes common merchants and expense types automatically."
    },
    {
      question: "Can I export my expense data?",
      answer: "Yes! You can export your data in multiple formats including CSV, Excel, and PDF. This makes it easy to share with accountants, import into other tools, or keep backup records. You own your data and can access it anytime."
    },
    {
      question: "Does the receipt scanning work with all types of receipts?",
      answer: "Our OCR technology works with most receipt formats including printed receipts, digital receipts, and even handwritten notes. While accuracy is very high, you can always review and edit the extracted information before saving."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes! We have mobile apps for both iOS and Android that sync seamlessly with the web version. You can track expenses on the go, snap photos of receipts, and access all your data from anywhere."
    },
    {
      question: "What's included in the free plan?",
      answer: "The free plan includes unlimited expense tracking, basic categorization, receipt scanning, and essential reports. Premium features like advanced analytics, budget alerts, and team sharing are available in our paid plans."
    },
    {
      question: "Can I connect my bank accounts?",
      answer: "We're working on bank integration features that will allow you to automatically import transactions. Currently, you can manually add expenses or use our receipt scanning feature for quick entry."
    },
    {
      question: "How do I get started?",
      answer: "Getting started is simple! Just sign up for a free account, and you can immediately begin adding expenses. Our onboarding process will guide you through the key features, and you'll be tracking expenses within minutes."
    }
  ];

  return (
    <section id="faq-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about Fintrack
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-green-100 rounded-lg px-6 data-[state=open]:border-green-200"
            >
              <AccordionTrigger className="text-left hover:text-green-600 hover:no-underline py-6">
                <span className="font-semibold">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <Button 
            variant="outline" 
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
