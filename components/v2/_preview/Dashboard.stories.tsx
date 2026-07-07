import type { Meta, StoryObj } from "@storybook/react-vite";
// Self-contained: the v2 stylesheet so the dashboard renders with the live
// design system and re-themes when the Token Editor injects token overrides.
import "../../../design-system/v2/index.css";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../Card/Card";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Label } from "../Label/Label";
import { Badge } from "../Badge/Badge";
import { Progress } from "../Progress/Progress";
import { Switch } from "../Switch/Switch";
import { Checkbox } from "../Checkbox/Checkbox";
import { Skeleton } from "../Skeleton/Skeleton";
import { Separator } from "../Separator/Separator";
import { Avatar, AvatarFallback } from "../Avatar/Avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../Tabs/Tabs";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "../Table/Table";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationPrevious, PaginationNext,
} from "../Pagination/Pagination";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../Tooltip/Tooltip";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer } from "../Chart/Chart";
import type { ChartConfig } from "../Chart/Chart.types";

/**
 * preview/Dashboard — the Token Editor's docked live preview.
 *
 * ONE composed dashboard: every card below is a real v2 component arrangement,
 * packed into a single masonry surface (CSS columns → cards size to content,
 * varied heights, no equal-width tiles). It matches the LAYOUT feel of a real
 * app dashboard — not a copy of any third-party design — using only standard
 * semantic utilities so a single token edit re-themes the whole surface.
 */
const meta: Meta = {
  title: "preview/Dashboard",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

// Real chart data + series config. The series color references a NEUTRAL
// semantic (--muted-foreground) rather than the brand chart-1, so the bars read
// as neutral and re-theme for light/dark. Still a real token (not hardcoded),
// and independent of --primary and --radius.
const chartData = [
  { month: "Dec", value: 40 },
  { month: "Jan", value: 70 },
  { month: "Feb", value: 55 },
  { month: "Mar", value: 85 },
  { month: "Apr", value: 35 },
  { month: "May", value: 95 },
];
const chartConfig: ChartConfig = {
  value: { label: "Contributions", color: "var(--muted-foreground)" },
};

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <div className="min-h-screen w-full bg-background p-5 text-foreground">
        {/* CSS columns masonry: cards flow top-to-bottom then wrap into the next
            column, each sized to its own content → the packed, varied-height
            collage in the reference, not a row of equal tiles. */}
        <div className="gap-4 columns-1 sm:columns-2 lg:columns-3 xl:columns-4">

          {/* Contribution History — chart card */}
          <Card className="mb-4 break-inside-avoid">
            <CardHeader>
              <CardTitle>Contribution History</CardTitle>
              <CardDescription>Last 6 months of activity</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Real BarChart — series color is --color-chart-1, radius is recharts'
                  fixed numeric prop. Correctly independent of --primary and --radius. */}
              <ChartContainer config={chartConfig} className="h-32 w-full">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <Button className="w-full">View Full Report</Button>
            </CardFooter>
          </Card>

          {/* Sign in — short form */}
          <Card className="mb-4 break-inside-avoid">
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Use your account credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="d-email">Email</Label>
                <Input id="d-email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="d-pass">Password</Label>
                <Input id="d-pass" type="password" defaultValue="secret-value" />
              </div>
              <label className="flex items-center gap-2 text-sm"><Checkbox defaultChecked /> Remember me</label>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" className="flex-1">Cancel</Button>
              <Button className="flex-1">Sign in</Button>
            </CardFooter>
          </Card>

          {/* Savings Targets — tall metrics card */}
          <Card className="mb-4 break-inside-avoid">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Savings Targets</CardTitle>
              <Badge variant="secondary">New Goal</Badge>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Retirement</p>
                <p className="text-3xl font-bold">$420,000</p>
                <Progress value={65} />
                <div className="flex justify-between text-xs text-muted-foreground"><span>65%</span><span>$273,000</span></div>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Real Estate</p>
                <p className="text-3xl font-bold">$85,000</p>
                <Progress value={32} />
                <div className="flex justify-between text-xs text-muted-foreground"><span>32%</span><span>$27,200</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences — toggles */}
          <Card className="mb-4 break-inside-avoid">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Manage notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Product updates", "Security alerts", "Weekly digest"].map((t, i) => (
                <div key={t}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t}</span>
                    <Switch defaultChecked={i !== 2} />
                  </div>
                  {i < 2 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Transactions — table */}
          <Card className="mb-4 break-inside-avoid">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Merchant</TableHead><TableHead className="text-right">Amount</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["Blue Bottle Coffee", "-$6.50"],
                    ["Whole Foods Market", "-$142.30"],
                    ["Stripe Payout", "+$4,200.00"],
                    ["Uber Technologies", "-$24.10"],
                    ["Netflix", "-$19.99"],
                  ].map(([m, a]) => (
                    <TableRow key={m}>
                      <TableCell className="font-medium">{m}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{a}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Team members — table with avatars + badges */}
          <Card className="mb-4 break-inside-avoid">
            <CardHeader>
              <CardTitle>Team members</CardTitle>
              <CardDescription>Roles and status</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {[
                    ["Ada Lovelace", "Owner", "default"],
                    ["Alan Turing", "Admin", "secondary"],
                    ["Grace Hopper", "Editor", "outline"],
                    ["Linus T.", "Viewer", "destructive"],
                  ].map(([name, role, variant]) => (
                    <TableRow key={name}>
                      <TableCell className="flex items-center gap-2 font-medium">
                        <Avatar className="size-6"><AvatarFallback>{name[0]}</AvatarFallback></Avatar>
                        {name}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={variant as "default" | "secondary" | "outline" | "destructive"}>{role}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Buy Investment — compact form */}
          <Card className="mb-4 break-inside-avoid">
            <CardHeader>
              <CardTitle>Buy Investment</CardTitle>
              <CardDescription>Amount to invest</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input defaultValue="$ 1,000.00" />
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Estimated Shares</span><span className="font-medium">1.95</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Buying Power</span><span className="font-medium">$12,450.00</span></div>
            </CardContent>
            <CardFooter><Button className="w-full">Review Order</Button></CardFooter>
          </Card>

          {/* Account tabs */}
          <Card className="mb-4 break-inside-avoid">
            <CardHeader><CardTitle>Account</CardTitle></CardHeader>
            <CardContent>
              <Tabs defaultValue="profile">
                <TabsList>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="pt-3">
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarFallback>AS</AvatarFallback></Avatar>
                    <div><p className="text-sm font-medium">Artist Studio</p><p className="text-xs text-muted-foreground">artist@studio.inc</p></div>
                  </div>
                </TabsContent>
                <TabsContent value="team" className="pt-3"><p className="text-sm text-muted-foreground">3 members in this workspace.</p></TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Quarterly goals — progress stack */}
          <Card className="mb-4 break-inside-avoid">
            <CardHeader><CardTitle>Quarterly goals</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[["Revenue", 72], ["New users", 45], ["Retention", 88], ["NPS", 34]].map(([label, val]) => (
                <div key={label as string} className="space-y-1.5">
                  <div className="flex justify-between text-sm"><span>{label}</span><span className="text-muted-foreground">{val}%</span></div>
                  <Progress value={val as number} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Loading state — skeletons */}
          <Card className="mb-4 break-inside-avoid">
            <CardHeader><CardTitle>Loading</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-2 flex-1"><Skeleton className="h-3 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
              </div>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>

          {/* Quick actions — buttons + badges + tooltip */}
          <Card className="mb-4 break-inside-avoid">
            <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Primary</Button>
                <Button size="sm" variant="secondary">Secondary</Button>
                <Button size="sm" variant="outline">Outline</Button>
                <Button size="sm" variant="ghost">Ghost</Button>
                <Button size="sm" variant="destructive">Delete</Button>
              </div>
              <Separator />
              <div className="flex flex-wrap gap-2">
                <Badge>Live</Badge>
                <Badge variant="secondary">Pending</Badge>
                <Badge variant="outline">Idle</Badge>
                <Badge variant="destructive">Failed</Badge>
              </div>
              <Tooltip>
                <TooltipTrigger asChild><Button variant="outline" size="sm">Hover me</Button></TooltipTrigger>
                <TooltipContent>A helpful hint</TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>

          {/* Pagination card */}
          <Card className="mb-4 break-inside-avoid">
            <CardHeader><CardTitle>Browse</CardTitle></CardHeader>
            <CardContent>
              <Pagination>
                <PaginationContent>
                  <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                  <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationNext href="#" /></PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardContent>
          </Card>

        </div>
      </div>
    </TooltipProvider>
  ),
};
