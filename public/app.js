// Create constants
const form = document.getElementById('course-form');
const formMessage = document.getElementById('form-message');
const list = document.getElementById('course-list');
const emptyMessage = document.getElementById('empty-message');
const searchInput = document.getElementById('search');

let courses = [];

// creating message
function setFormMessage (text, type){
     formMessage.textContent = text;
     formMessage.className = 'message' + (type ? ' ' + type : '');
}

function render() {
     // whats being searched for
     const query = searchInput.value.trim().toLowerCase();

     //searching
     const visible = courses.filter((c) =>
          [c.course_name, c.student_name]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query))
     );

     //clear the old list
     list.replaceChildren()

     // handle nothing to show
     if (visible.length === 0) {
          emptyMessage.hidden = false;
          emptyMessage.textContent = courses.length === 0
               ? 'No sessions yet. Add the first one above.'
               : 'No sessions match your search.';
          return;
     }
     emptyMessage.hidden = true;

     for (const c of visible) {
          const item = document.createElement('li');
          item.className = 'course-item';

          const title = document.createElement('h3');
          title.textContent = c.course_name;

          const who = document.createElement('p');
          const whoLabel = document.createElement('strong');
          whoLabel.textContent = 'Student ';
          who.append(whoLabel, c.student_name || 'Not provided');

          const when = document.createElement('p');
          const whenLabel = document.createElement('strong');
          whenLabel.textContent = 'Available: ';
          when.append(whenLabel, c.availability || 'Not provided');

          item.append(title, who, when);
          list.append(item);
     }
}

async function loadCourses() {
     try {
          const res = await fetch ('/api/courses');
          if (!res.ok) throw new Error ('Request failed');
          courses = await res.json();
          render()
     } catch (err) {
          courses = [
               { course_name: 'CS396', student_name: 'Alex', availability: 'Tuesday 3–5 pm' },
               { course_name: 'CS396', student_name: 'Sam', availability: 'Tuesday 3–5 pm' }
          ];
          render();
          emptyMessage.hidden = false;
          emptyMessage.textContent = 'Could not load sessions. Showing sample data. Check that the server is running.';
     }
}

form.addEventListener('submit', async(event) => {
     event.preventDefault();

     const payload = {
          course_name: form.course_name.value.trim(),
          student_name: form.student_name.value.trim(),
          availability: form.availability.value.trim(),
     };

     if (!payload.course_name) {
          setFormMessage('Enter a course name.', 'error');
          form.course_name.focus();
          return;
     }
     if (!payload.student_name) {
          setFormMessage('Enter your name.', 'error');
          form.student_name.focus();
          return;
     }
     if (!payload.availability) {
          setFormMessage('Enter your availability.', 'error');
          form.availability.focus();
          return;
     }

     const button = form.querySelector('button');
     // don't allow double-clicking
     button.disabled = true;
     setFormMessage();

     try {
          const res = await fetch ('/api/courses', {
               method: 'POST',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify(payload),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Could not add session');

          form.reset();
          setFormMessage('Session added.', 'success');
          await loadCourses();

     } catch (err) {
          setFormMessage(err.message, 'error');
     } finally {
          button.disabled = false;
     }
});

searchInput.addEventListener('input', render);

loadCourses();