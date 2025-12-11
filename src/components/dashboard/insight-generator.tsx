'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, AlertTriangle, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAiInsights } from '@/app/actions';
import type { GenerateInsightsInput } from '@/ai/flows/automated-insight-generator';

interface InsightGeneratorProps {
  kpisForInsights: Omit<GenerateInsightsInput, 'promoType' | 'product' | 'region'>;
}

export function InsightGenerator({ kpisForInsights }: InsightGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    setIsOpen(true);
    setError(null);
    setInsights([]);
    startTransition(async () => {
      const result = await getAiInsights(kpisForInsights);
      if (result.success) {
        setInsights(result.insights);
      } else {
        setError(result.error || 'An unknown error occurred.');
        toast({
          variant: 'destructive',
          title: 'Insight Generation Failed',
          description: result.error || 'Could not connect to the AI service.',
        });
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <Button onClick={handleGenerate} disabled={isPending}>
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Generate Insights
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Automated Insights
            </DialogTitle>
            <DialogDescription>
              AI-powered analysis of your current dashboard view.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isPending && (
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">
                  Analyzing data and generating insights...
                </p>
              </div>
            )}
            {error && (
               <Alert variant="destructive">
                 <AlertTriangle className="h-4 w-4" />
                 <AlertTitle>Error</AlertTitle>
                 <AlertDescription>{error}</AlertDescription>
               </Alert>
            )}
            {!isPending && insights.length > 0 && (
              <div className="flex flex-col gap-3">
                {insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-lg border bg-card p-3">
                         <Lightbulb className="h-5 w-5 flex-shrink-0 text-accent mt-1" />
                        <p className="text-sm text-card-foreground">{insight}</p>
                    </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
