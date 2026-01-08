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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, CalendarCheck, AlertTriangle, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPromoOptimizations } from '@/app/actions';
import type { PromoCalendarInput, PromoCalendarOutput } from '@/ai/flows/promo-optimizer-flow';
import { getWeek } from 'date-fns';

interface PromoOptimizerProps {
  optimizerParams: { product: string, region: string };
}

export function PromoOptimizer({ optimizerParams }: PromoOptimizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<PromoCalendarOutput['recommendations']>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    setIsOpen(true);
    setError(null);
    setRecommendations([]);
    startTransition(async () => {
      const input: PromoCalendarInput = {
        ...optimizerParams,
        currentWeek: getWeek(new Date()),
      };
      const result = await getPromoOptimizations(input);
      if (result.success && result.recommendations) {
        setRecommendations(result.recommendations);
      } else {
        setError(result.error || 'An unknown error occurred.');
        toast({
          variant: 'destructive',
          title: 'Optimization Failed',
          description: result.error || 'Could not connect to the AI service.',
        });
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <Button onClick={handleGenerate} disabled={isPending} variant="outline">
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-4 w-4" />
        )}
        Optimize Calendar
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              Optimized Promotion Calendar
            </DialogTitle>
            <DialogDescription>
              AI-powered recommendations for the next quarter based on your current filter context.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isPending && (
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">
                  Analyzing opportunities and generating your promo calendar...
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
            {!isPending && recommendations.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Week</TableHead>
                        <TableHead>Promo Type</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Justification</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recommendations.map((rec, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{rec.week}</TableCell>
                            <TableCell>{rec.promoType}</TableCell>
                            <TableCell>{rec.discountDepth}</TableCell>
                            <TableCell>{rec.justification}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
