import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Section({ 
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section 
      className={cn("py-6 md:py-10", className)} 
      {...props}
    >
      {children}
    </section>
  );
}

interface H1Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function H1({
  className,
  children,
  ...props
}: H1Props) {
  return (
    <h1 
      className={cn("scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl", className)} 
      {...props}
    >
      {children}
    </h1>
  );
}

interface H2Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function H2({
  className,
  children,
  ...props
}: H2Props) {
  return (
    <h2 
      className={cn("scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0", className)} 
      {...props}
    >
      {children}
    </h2>
  );
}

interface H3Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function H3({
  className,
  children,
  ...props
}: H3Props) {
  return (
    <h3 
      className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)} 
      {...props}
    >
      {children}
    </h3>
  );
}

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function Paragraph({
  className,
  children,
  ...props
}: ParagraphProps) {
  return (
    <p 
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} 
      {...props}
    >
      {children}
    </p>
  );
}

interface LeadProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function Lead({
  className,
  children,
  ...props
}: LeadProps) {
  return (
    <p 
      className={cn("text-xl text-muted-foreground", className)} 
      {...props}
    >
      {children}
    </p>
  );
}

interface BlockquoteProps extends React.HTMLAttributes<HTMLQuoteElement> {
  children: React.ReactNode;
}

export function Blockquote({
  className,
  children,
  ...props
}: BlockquoteProps) {
  return (
    <blockquote 
      className={cn("mt-6 border-l-2 pl-6 italic", className)} 
      {...props}
    >
      {children}
    </blockquote>
  );
}

interface InlineCodeProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function InlineCode({
  className,
  children,
  ...props
}: InlineCodeProps) {
  return (
    <code 
      className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold", className)} 
      {...props}
    >
      {children}
    </code>
  );
}

interface ListProps extends React.OlHTMLAttributes<HTMLOListElement> {
  children: React.ReactNode;
}

export function List({
  className,
  children,
  ...props
}: ListProps) {
  return (
    <ul 
      className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} 
      {...props}
    >
      {children}
    </ul>
  );
}

interface OrderedListProps extends React.OlHTMLAttributes<HTMLOListElement> {
  children: React.ReactNode;
}

export function OrderedList({
  className,
  children,
  ...props
}: OrderedListProps) {
  return (
    <ol 
      className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)} 
      {...props}
    >
      {children}
    </ol>
  );
}

interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

export function ListItem({
  className,
  children,
  ...props
}: ListItemProps) {
  return (
    <li 
      className={cn("", className)} 
      {...props}
    >
      {children}
    </li>
  );
}

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div 
      className={cn("container mx-auto px-4", className)} 
      {...props}
    >
      {children}
    </div>
  );
}

export { 
  Section as default,
};