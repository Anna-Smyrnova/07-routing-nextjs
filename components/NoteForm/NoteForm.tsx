import css from "./NoteForm.module.css";
import * as yup from 'yup';
import { Field, Formik, ErrorMessage, type FormikHelpers} from 'formik';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { NewNote } from "@/types/note";
import { useId } from "react";

interface NoteFormProps {
  onClose: () => void;
}

interface NoteFormValues {
title: string,
content: string,
tag: "Work" | "Personal" | "Meeting" | "Shopping" | "Todo",
};


const initialValues: NoteFormValues = {
title: '',
content: '',
tag: 'Todo',
};


const  NoteFormSchema = yup.object().shape({
  title: yup.string()
  .min(3, "Title too short!")
  .max(50, "Title too long!")
  .required("Required field!"),
   content: yup.string()
  .max(500, "Too long!"),
   tag: yup.string()
   .oneOf (["Work", "Personal", "Meeting", "Shopping", "Todo"])
   .required("Required field!"),
   });


export default function NoteForm({ onClose }: NoteFormProps) {

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (newNote: NewNote) => createNote (newNote),
        onSuccess() {
            queryClient.invalidateQueries({queryKey: ['notes']});
              onClose();
        },
    });

const fieldId = useId();

const onSubmit = (
  values: NoteFormValues,
  formikHelpers: FormikHelpers<NoteFormValues>
) => {
  mutation.mutate(values, {
    onSuccess: () => {
      formikHelpers.resetForm();
      formikHelpers.setSubmitting(false);
      },
      onError: () => {
        formikHelpers.setSubmitting(false);},
  });
};
    return ( <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={NoteFormSchema}
        >
        {({handleSubmit, isSubmitting}) => (  
           <form onSubmit={handleSubmit} className={css.form}>
  <div className={css.formGroup}>
    <label htmlFor={`${fieldId}-title`}>Title</label>
    <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
    <ErrorMessage name="title" component="span" className={css.error} />
  </div>

  <div className={css.formGroup}>
    <label htmlFor={`${fieldId}-content`}>Content</label>
    <Field as="textarea"
      id={`${fieldId}-content`}
      name="content"
      rows={8}
      className={css.textarea}
    />
    <ErrorMessage name="content" component="span" className={css.error} />
      </div>

  <div className={css.formGroup}>
    <label htmlFor={`${fieldId}-tag`}>Tag</label>
    <Field as="select" id={`${fieldId}-tag`} name="tag" className={css.select}>
      <option value="Todo">Todo</option>
      <option value="Work">Work</option>
      <option value="Personal">Personal</option>
      <option value="Meeting">Meeting</option>
      <option value="Shopping">Shopping</option>
    </Field>
    <ErrorMessage name="tag" component="span" className={css.error} />
  </div>

  <div className={css.actions}>
    <button type="button" className={css.cancelButton} onClick={onClose}>
      Cancel
    </button>
    <button
      type="submit"
      className={css.submitButton}
      disabled={isSubmitting }
      >
      {isSubmitting ? 'Creating...' : 'Create Note'}
    </button>
  </div>
</form>
)}
 </Formik>
);
}