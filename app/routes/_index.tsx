import type { Route } from './+types/_index'

import { eq } from 'drizzle-orm'
import { XIcon } from 'lucide-react'
import { Form } from 'react-router'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createDrizzleClient } from '@/server/db'
import { posts } from '@/server/db/schema'

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = createDrizzleClient(context.cloudflare.env)

  const records = await db.select().from(posts)

  return {
    message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
    posts: records,
  }
}

export async function action({ request, context }: Route.ActionArgs) {
  if (request.method === 'POST') {
    const formData = await request.formData()
    const title = formData.get('title')
    const content = formData.get('content')

    if (typeof title !== 'string' || typeof content !== 'string')
      return { success: false, error: 'Invalid form data' }

    const db = createDrizzleClient(context.cloudflare.env)
    await db.insert(posts).values({ title, content })

    return { success: true }
  } else if (request.method === 'DELETE') {
    const formData = await request.formData()
    const id = formData.get('id')

    if (typeof id !== 'string')
      return { success: false, error: 'Invalid form data' }

    const db = createDrizzleClient(context.cloudflare.env)
    await db.delete(posts).where(eq(posts.id, Number(id)))

    return { success: true }
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main className='container mx-auto flex flex-col gap-6 p-4'>
      <h1 className='sr-only'>Home Page</h1>

      <Card>
        <CardHeader>
          <CardTitle>Environment Variable from Cloudflare</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{loaderData.message}</p>
        </CardContent>
      </Card>

      <section className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <h2 className='sr-only'>Posts</h2>

        {loaderData.posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>#{post.id}</CardDescription>
              <Form
                method='delete'
                className='col-start-2 row-span-2 row-start-1 self-start justify-self-end'
              >
                <input type='hidden' name='id' value={post.id} />

                <Button type='submit' variant='ghost' size='icon'>
                  <XIcon />
                </Button>
              </Form>
            </CardHeader>
            <CardContent>
              <p>{post.content}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Add a New Post</CardTitle>
          <CardDescription>
            Submit the form below to add a new post.
          </CardDescription>
        </CardHeader>

        <Form method='post' className='px-6'>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='title'>Title</FieldLabel>
                <Input id='title' name='title' required />
              </Field>
              <Field>
                <FieldLabel htmlFor='content'>Content</FieldLabel>
                <Textarea id='content' name='content' required />
              </Field>
              <Field>
                <Button type='submit'>Add Post</Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </Form>
      </Card>
    </main>
  )
}
