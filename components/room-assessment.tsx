"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "@/components/icons";

interface RoomAssessmentProps {
  title?: string;
  description?: string;
}

export function RoomAssessmentQuestionnaire({ 
  title = "Quick Room Assessment",
  description = "Answer a few questions about your space and get tailored recommendations." 
}: RoomAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      id: 0,
      question: "What is the primary use of your space?",
      options: [
        { text: "Boardroom / Conference room", weight: 1 },
        { text: "Restaurant / Dining", weight: 2 },
        { text: "Hotel lobby / Event space", weight: 2 },
        { text: "Worship / Church", weight: 3 },
        { text: "Classroom / Education", weight: 1 },
        { text: "Retail / Commercial", weight: 2 },
      ],
    },
    {
      id: 1,
      question: "How would you rate your current audio quality?",
      options: [
        { text: "Excellent - no issues", weight: 0 },
        { text: "Good - minor issues", weight: 1 },
        { text: "Fair - noticeable problems", weight: 2 },
        { text: "Poor - major frustrations", weight: 3 },
      ],
    },
    {
      id: 2,
      question: "What's your biggest AV challenge right now?",
      options: [
        { text: "Unclear speech / dialogue", weight: 3 },
        { text: "Uneven sound coverage", weight: 2 },
        { text: "Feedback or echo issues", weight: 3 },
        { text: "Difficult to manage / control", weight: 2 },
        { text: "Outdated equipment", weight: 1 },
        { text: "No major issues", weight: 0 },
      ],
    },
    {
      id: 3,
      question: "How many people typically use the space?",
      options: [
        { text: "Under 10", weight: 0 },
        { text: "10–30", weight: 1 },
        { text: "30–75", weight: 2 },
        { text: "75–150", weight: 2 },
        { text: "150+", weight: 3 },
      ],
    },
    {
      id: 4,
      question: "What type of content do you display / present?",
      options: [
        { text: "No displays needed", weight: 0 },
        { text: "Occasional presentations", weight: 1 },
        { text: "Regular presentations + signage", weight: 2 },
        { text: "Constant displays (info, ads, menus)", weight: 2 },
        { text: "Live streaming / video conferencing", weight: 2 },
      ],
    },
    {
      id: 5,
      question: "How important is remote access / streaming?",
      options: [
        { text: "Not needed", weight: 0 },
        { text: "Nice to have", weight: 1 },
        { text: "Important", weight: 2 },
        { text: "Critical", weight: 3 },
      ],
    },
  ];

  const handleResponse = (optionWeight: number) => {
    const newResponses = { ...responses, [currentQuestion]: optionWeight };
    setResponses(newResponses);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newResponses);
    }
  };

  const calculateResults = (finalResponses: Record<number, number>) => {
    setShowResults(true);
    setResponses(finalResponses);
  };

  const handleSubmitResults = async () => {
    if (!userEmail) return;

    try {
      await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          responses,
          score: Object.values(responses).reduce((a, b) => a + b, 0),
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (showResults) {
    return (
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-[var(--color-border)] bg-white p-10 shadow-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-semibold text-slate-950">Assessment Complete</h2>
            <p className="mt-2 text-slate-600">{new Date().toLocaleDateString()}</p>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-slate-50 p-6">
            <p className="font-semibold text-slate-950">Our Recommendation</p>
            <p className="mt-3 leading-7 text-slate-700">{Object.values(responses).reduce((a, b) => a + b, 0) < 10 ? questions[0].options[0].text : "Comprehensive AV upgrade recommended"}</p>

            <div className="mt-6 space-y-2">
              <p className="font-semibold text-slate-950">Key Insights</p>
              <ul className="space-y-2">
                {(Object.values(responses).reduce((a, b) => a + b, 0) < 10
                  ? ["Consider a health check of existing systems", "Explore upgrades for better control and ease of use"]
                  : ["Address audio clarity and coverage issues", "Upgrade aging equipment", "Plan for future scalability"]
                ).map((insight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {!submitted ? (
            <div className="mt-8 space-y-4">
              <label className="block text-sm text-slate-700">
                <span className="mb-2 block font-semibold">Get a personalized proposal</span>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400"
                />
              </label>
              <button
                onClick={handleSubmitResults}
                className="w-full rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#105cda]"
              >
                Send Assessment Results
              </button>
            </div>
          ) : (
            <div className="mt-8 rounded-lg bg-green-50 p-4 text-sm text-green-900">
              <p className="font-semibold">Thanks! We&apos;ll be in touch soon with tailored recommendations.</p>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-slate-500">
            Your assessment data helps us provide personalized recommendations. We&apos;ll contact you within 24 hours.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-[2rem] border border-[var(--color-border)] bg-white p-10 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-2 text-slate-600">{description}</p>
        <div className="mt-6 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary)] transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-slate-600">Question {currentQuestion + 1} of {questions.length}</p>
      </div>

      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="mb-6 text-lg font-semibold text-slate-950">
          {questions[currentQuestion].question}
        </h3>

        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleResponse(option.weight)}
              className="w-full rounded-xl border-2 border-[var(--color-border)] bg-white p-4 text-left text-slate-900 transition hover:border-[var(--color-primary)] hover:bg-blue-50"
            >
              <p className="font-medium">{option.text}</p>
            </button>
          ))}
        </div>
      </motion.div>

      <p className="mt-8 text-center text-xs text-slate-500">
        Takes about 2 minutes • No commitment required
      </p>
    </div>
  );
}
