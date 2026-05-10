import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

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
    } = body;

    const reportUrl = `http://localhost:3000/audit/report/${reportId}`;

    const data =
      await resend.emails.send({
        from:
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
              <strong>$${monthlySavings}</strong>
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
    console.error(
      "EMAIL ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}