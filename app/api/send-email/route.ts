import { Resend } from "resend";
import { z } from "zod";

const sendEmailSchema = z.object({
  email: z.string().email().max(320),
  monthlySavings: z.number().finite().min(0).max(10_000_000),
  reportId: z.string().min(8).max(120).regex(/^[a-zA-Z0-9_-]+$/),
});

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    const {
      email,
      monthlySavings,
      reportId,
    } = sendEmailSchema.parse(body);

    if (!process.env.RESEND_API_KEY) {
      return Response.json(
        {
          success: false,
          error: "Email delivery is not configured.",
        },
        {
          status: 503,
        }
      );
    }

    const resend = new Resend(
      process.env.RESEND_API_KEY
    );

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      req.headers.get("origin") ??
      "http://localhost:3000";

    const reportUrl =
      new URL(
        `/audit/report/${encodeURIComponent(reportId)}`,
        appUrl
      ).toString();

    const data =
      await resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL ??
          "TokenGuard <onboarding@resend.dev>",

        to: [email],

        subject:
          "Your TokenGuard AI audit report is ready",

        html: `
          <div style="font-family: sans-serif; padding: 24px;">
            <h1>TokenGuard Audit Report</h1>

            <p>
              Your AI spend audit has been generated successfully.
            </p>

            <p>
              Estimated Monthly Savings:
              <strong>$${monthlySavings.toFixed(2)}</strong>
            </p>

            <p>
              View your report:
            </p>

            <a
              href="${reportUrl}"
              style="
                display:inline-block;
                margin-top:12px;
                padding:12px 18px;
                background:black;
                color:white;
                text-decoration:none;
                border-radius:999px;
              "
            >
              Open Audit Report
            </a>

            <p style="margin-top:32px; color:#666;">
              TokenGuard will continue monitoring optimization opportunities as AI tooling pricing evolves.
            </p>
          </div>
        `,
      });

    return Response.json({
      success: true,
      data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          success: false,
          error: "Invalid email request.",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: false,
        error: "Email delivery failed.",
      },
      {
        status: 500,
      }
    );
  }
}
