export default {
  name: 'set',
  title: 'Set',
  type: 'document',
  fields: [
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'venue',
      title: 'Venue',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'ticketUrl',
      title: 'Ticket URL',
      type: 'url',
      description: 'Optional. Leave blank if no tickets / free event.'
    }
  ]
}
