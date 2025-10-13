import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowBack, CheckCircle, Payment as PaymentIcon } from '@mui/icons-material';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Job, Payment } from '@shared/schema';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const [, params] = useRoute('/jobs/:id/payment');
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const jobId = params?.id;

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch job details
  const { data: job, isLoading: jobLoading } = useQuery<Job>({
    queryKey: ['/api/jobs', jobId],
    enabled: !!jobId,
  });

  // Check for existing payment
  const { data: existingPayment } = useQuery<Payment>({
    queryKey: ['/api/payments/job', jobId],
    enabled: !!jobId,
    retry: false,
  });

  // Create payment order mutation
  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/payments/create-order', { jobId });
      return res.json();
    },
    onSuccess: (data: any) => {
      if (!razorpayLoaded) {
        toast({
          title: 'Error',
          description: 'Payment gateway is loading. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Initialize Razorpay
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Dehadi.co.in',
        description: `Payment for ${job?.title}`,
        order_id: data.orderId,
        handler: async function (response: any) {
          // Verify payment
          verifyPaymentMutation.mutate({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
        },
        prefill: {
          name: 'Employer',
          email: 'employer@example.com',
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function () {
            toast({
              title: 'Payment Cancelled',
              description: 'You cancelled the payment process.',
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    },
    onError: (error: any) => {
      // Extract server error message if available
      // apiRequest throws Error with message format: "statusCode: responseText"
      let errorMessage = 'Failed to create payment order';
      try {
        const errorText = error?.message || '';
        // Match format like "503: {"message":"..."}"
        const match = errorText.match(/^\d+:\s*(.+)$/);
        if (match) {
          try {
            const parsed = JSON.parse(match[1]);
            errorMessage = parsed.message || errorMessage;
          } catch {
            // If not JSON, use the text as-is
            errorMessage = match[1];
          }
        }
      } catch (e) {
        // Use default message
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  // Verify payment mutation
  const verifyPaymentMutation = useMutation({
    mutationFn: async (data: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    }) => {
      const res = await apiRequest('POST', '/api/payments/verify', data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Payment Successful!',
        description: 'The payment has been completed successfully.',
      });
      // Invalidate queries and navigate
      queryClient.invalidateQueries({ queryKey: ['/api/jobs', jobId] });
      queryClient.invalidateQueries({ queryKey: ['/api/payments/job', jobId] });
      setTimeout(() => navigate(`/jobs/${jobId}`), 2000);
    },
    onError: (error: any) => {
      // Extract server error message if available
      // apiRequest throws Error with message format: "statusCode: responseText"
      let errorMessage = 'Failed to verify payment';
      try {
        const errorText = error?.message || '';
        // Match format like "400: {"message":"..."}"
        const match = errorText.match(/^\d+:\s*(.+)$/);
        if (match) {
          try {
            const parsed = JSON.parse(match[1]);
            errorMessage = parsed.message || errorMessage;
          } catch {
            // If not JSON, use the text as-is
            errorMessage = match[1];
          }
        }
      } catch (e) {
        // Use default message
      }
      
      toast({
        title: 'Payment Verification Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4">
          <Skeleton className="h-12 w-12 rounded-full mb-4" />
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background p-4">
        <p className="text-center text-muted-foreground">Job not found</p>
      </div>
    );
  }

  const wageLabel = job.wageType === 'daily' ? '/day' : job.wageType === 'hourly' ? '/hour' : '';
  const isPaymentComplete = existingPayment?.status === 'completed' || job.status === 'paid';

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="flex items-center gap-4 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/jobs/${jobId}`)}
            data-testid="button-back"
          >
            <ArrowBack />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Payment</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Payment Status */}
        {isPaymentComplete && (
          <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600 dark:text-green-400" sx={{ fontSize: 32 }} />
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-100">Payment Completed</p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    This job has been paid successfully
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Job Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PaymentIcon />
              Job Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Job Title</p>
              <p className="font-semibold text-foreground">{job.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-foreground">{job.location}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Amount</p>
              <p className="text-2xl font-bold text-chart-3">
                ₹{job.wage}{wageLabel}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={job.status === 'paid' ? 'default' : 'secondary'} className="mt-1">
                {job.status === 'awaiting_payment' ? 'Awaiting Payment' : 
                 job.status === 'paid' ? 'Paid' : job.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Payment Actions */}
        {!isPaymentComplete && job.status === 'awaiting_payment' && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Payment Gateway</p>
                <div className="flex items-center gap-2">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" 
                    alt="Razorpay" 
                    className="h-6"
                  />
                  <span className="text-xs text-muted-foreground">Secure payment powered by Razorpay</span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => createOrderMutation.mutate()}
                disabled={createOrderMutation.isPending || verifyPaymentMutation.isPending || !razorpayLoaded}
                data-testid="button-pay-now"
              >
                {createOrderMutation.isPending || verifyPaymentMutation.isPending ? (
                  'Processing...'
                ) : !razorpayLoaded ? (
                  'Loading Payment Gateway...'
                ) : (
                  `Pay ₹${job.wage} Now`
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By proceeding, you agree to pay the worker ₹{job.wage}{wageLabel} for completing this job.
              </p>
            </CardContent>
          </Card>
        )}

        {job.status !== 'awaiting_payment' && !isPaymentComplete && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                This job must be marked as completed before payment can be made.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
