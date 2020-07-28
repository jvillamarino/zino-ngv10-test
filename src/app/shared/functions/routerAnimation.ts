import {
  trigger,
  query,
  style,
  animate,
  transition,
  group,
  animateChild,
} from '@angular/animations';
export const slideInAnimation = trigger('routeAnimations', [
  transition('Login <=> Register', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        opacity: 0
      }),
    ]),
    query(':enter', [style({ left: '-100%' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('500ms ease-out', style({ right: '0%', opacity: 0 }))]),
      query(':enter', [animate('500ms ease-out', style({ left: '0%', opacity: 1}))]),
    ]),
    query(':enter', animateChild()),
  ]),
]);
