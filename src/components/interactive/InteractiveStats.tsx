import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

interface Stat {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix: string;
  color: string;
}

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold">
      {count.toLocaleString()}
      {suffix}
    </div>
  );
};

export const InteractiveStats = ({ language }: { language: 'en' | 'hi' }) => {
  const stats: Stat[] = [
    {
      icon: <Users className="h-8 w-8" />,
      value: 50000,
      label: language === 'en' ? 'Active Learners' : 'सक्रिय शिक्षार्थी',
      suffix: '+',
      color: 'text-primary',
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      value: 150,
      label: language === 'en' ? 'Courses Available' : 'उपलब्ध कोर्स',
      suffix: '+',
      color: 'text-success',
    },
    {
      icon: <Award className="h-8 w-8" />,
      value: 25000,
      label: language === 'en' ? 'Certificates Issued' : 'जारी प्रमाणपत्र',
      suffix: '+',
      color: 'text-warning',
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      value: 92,
      label: language === 'en' ? 'Success Rate' : 'सफलता दर',
      suffix: '%',
      color: 'text-accent',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          className="relative group"
        >
          <div className="bg-card hover:bg-card-hover border rounded-xl p-6 text-center transition-all duration-300 shadow-md hover:shadow-xl">
            <motion.div
              className={`${stat.color} mb-4 inline-block`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              {stat.icon}
            </motion.div>
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              {stat.label}
            </p>
            <motion.div
              className={`absolute -inset-0.5 ${stat.color.replace('text-', 'bg-')} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity -z-10`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
